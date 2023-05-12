
import { Graph } from "./Graph"
import { Rows } from "./Rows"
import { Tx, usePrices, useTxs } from "../api"
import styles from "./App.module.css"
import { useState } from "react"
import { Pill } from "./Pill"
import { IconArrowLeft } from "untitled-ui-icons"
import { ErrorHandler } from "./ErrorHandler"

export const App = () => {
    const txsResponse = useTxs()
    const pricesResponse = usePrices()
    const [ selection, setSelection ] = useState( null as Tx | null )
    return <ErrorHandler response={ txsResponse }>{ txs =>
        <ErrorHandler response={ pricesResponse }>{ prices =>
            <div className={ styles.container }>
                <div className={ styles.rows }>
                    <Rows prices={ prices } selection={ selection } setSelection={ setSelection }txs={ txs }/>
                </div>
                <div className={ styles.graph }>
                    { selection ? <Graph tx={ selection }/> : <Pill icon={ <IconArrowLeft/> }>Hover a transaction to see its graph</Pill> }
                </div>
            </div>
        }</ErrorHandler>
    }</ErrorHandler>
}
