import ForceGraph, { ForceGraphMethods } from "react-force-graph-2d"
import { Tx } from "../api"
import { green, hashColor, hashEmoji, red } from "../utils"
import { unique } from "../utils"
import { memo, useEffect, useRef, useState } from "react"
import { z } from "zod"

type GraphData = {
    nodes: { id: string }[],
    links: { source: string, target: string, width: number }[],
}

export const Graph = memo( ( { tx }: { tx: Tx } ) => {
    const ref = useRef( undefined as ForceGraphMethods | undefined )
    const [ graphData, setGraphData ] = useState( { nodes: [], links: [] } as GraphData )
    useEffect( () => {
        const scale = 10 / Math.max( ...tx.io.map( _ => Math.abs( _.value ) ) )
        setGraphData( ( { nodes } ) => ( {
            nodes: unique( [ tx.hash, ...tx.io.map( _ => _.address ) ] ).map( id => ( { ...nodes.find( node => node.id === id ), id, name: id } ) ),
            links: tx.io.map( _ => {
                const commonLinks = tx.io.filter( link => link.address === _.address )
                return {
                    source: _.value > 0 ? tx.hash : _.address,
                    target: _.value > 0 ? _.address : tx.hash,
                    width: 1 + Math.abs( _.value ) * scale,
                    color: _.value > 0 ? green : red,
                    name: `${ Math.abs( _.value ) / 1e8 } BTC`,
                    curvature: commonLinks.length === 1 ? 0 : ( commonLinks.findIndex( link => link === _ ) / ( commonLinks.length - 1 ) - 0.5 ) * ( _.value > 0 ? 1 : - 1 )
                }
            } )
        } ) )
        ref.current?.zoom( 80 / ( 8 + Math.sqrt( tx.io.length ) ) )
    }, [ tx ] )
    return <ForceGraph
        width={ window.innerWidth * 1.5 }
        ref={ ref }
        graphData={ graphData }
        linkDirectionalArrowLength={ node => node.width / 2 + 1 }
        nodeCanvasObject={ ( node, ctx ) => {
            const parsing = z.object( { id: z.string(), x: z.number(), y: z.number() } ).safeParse( node )
            if ( ! parsing.success ) return
            ctx.fillStyle = hashColor( parsing.data.id )
            ctx.beginPath()
            ctx.arc( parsing.data.x, parsing.data.y, 4, 0, 2 * Math.PI )
            ctx.fill()
            if ( node.id !== tx.hash ) {
                const label = hashEmoji( parsing.data.id )
                ctx.font = "0.3em Tossface"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText( label, parsing.data.x, parsing.data.y + 0.8 )
            }
        } }
        linkCurvature="curvature"
        linkWidth="width"
        onNodeClick={ node => "?????" !== node.id && window.open( `https://blockchain.com/${ tx.hash === node.id ? "explorer/transactions/btc" : "btc/address" }/${ node.id }`, "_blank" ) }
    />
} )
