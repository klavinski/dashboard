import { useEffect, useState } from "react"
import { z, ZodType } from "zod"

const txParser = z.object( {
    op: z.literal( "utx" ),
    x: z.object( {
        hash: z.string(),
        time: z.number(),
        inputs: z.array( z.object( {
            prev_out: z.object( {
                addr: z.string().nullable(),
                value: z.number(),
            } ),
        } ) ),
        out: z.array( z.object( {
            addr: z.string().nullable(),
            value: z.number(),
        } ) ),
    } ),
} )

export type Tx = {
    hash: string,
    time: number,
    io: { address: string | "?????", value: number }[],
}

const makeUseWebSocket = <T, P extends ZodType>( url: string, initialValue: T, parser: P, makeSetData: ( message: z.infer<P> ) => ( oldData: T ) => T, onOpen?: ( webSocket: WebSocket ) => () => void ) => () => {
    const [ data, setData ] = useState( initialValue )
    const [ error, setError ] = useState( null as Error | null )
    useEffect( () => {
        const webSocket = new WebSocket( url )
        if ( onOpen )
            webSocket.onopen = onOpen( webSocket )
        webSocket.onmessage = ( { data } ) => {
            const parsing = parser.safeParse( JSON.parse( data ) )
            if ( parsing.success )
                setData( makeSetData( parsing.data ) )
            else
                setError( new Error( `received ${ JSON.stringify( data ) } from ${ url }, violating the schema: ${ parsing.error.message }` ) )
        }
        return () => {
            if ( webSocket.readyState === WebSocket.OPEN )
                webSocket.close()
        }
    }, [] )
    return { data, error }
}

export const useTxs = makeUseWebSocket(
    "wss://ws.blockchain.info/inv",
    [] as Tx[],
    txParser,
    ( { x: { hash, time, inputs, out } } ) => txs => [ ...txs.filter( tx => tx.time > time * 1e3 && tx.hash !== hash ), { io: [ ...inputs.map( _ => ( { address: _.prev_out.addr ?? "?????", value: - _.prev_out.value } ) ), ...out.map( _ => ( { address: _.addr ?? "?????", value: _.value } ) ) ], hash, time: time * 1e3 }, ...txs.filter( tx => tx.time <= time * 1e3 && tx.hash !== hash ) ].slice( 0, 500 ),
    webSocket => () => webSocket.send( JSON.stringify( { op: "unconfirmed_sub" } ) )
)

export type Price = { price: number, time: number }

export const usePrices = makeUseWebSocket(
    "wss://ws.coincap.io/prices?assets=bitcoin",
    [] as Price[],
    z.object( { bitcoin: z.coerce.number() } ),
    message => prices => [ ...prices, { price: message.bitcoin, time: Date.now() } ]
)
