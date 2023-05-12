import { Price, Tx } from "../api"
import { IconArrowRight, IconClock, IconHash, IconUser } from "@tabler/icons-react"
import { IconCoinsHand, IconCoinsStacked02, IconCurrencyBitcoin, IconCurrencyDollar } from "untitled-ui-icons"
import { ComponentPropsWithoutRef, Dispatch, SetStateAction } from "react"
import TimeAgo from "timeago-react"
import styles from "./Rows.module.css"
import { Pill } from "./Pill"
import { unique } from "../utils"
import { Hash } from "./Hash"
import { Tooltip } from "./Tooltip"

const Amount = ( { amount, price }: { amount: number, price?: number } ) => <Tooltip content={ <><Pill icon={ <IconCurrencyBitcoin/> }>1</Pill> = <Pill icon={ <IconCurrencyDollar/> }>{ price ?? "?" }</Pill></> }>
    <div className={ styles.number }>
        <Pill icon={ <IconCurrencyDollar/> }>{ price ? ( amount * price ).toFixed( 2 ) : "?" }</Pill>
        <Pill icon={ <IconCurrencyBitcoin/> }>{ amount.toFixed( 2 ) }</Pill>
    </div>
</Tooltip>

const Row = ( { price, selected, setSelection, tx }: { price: number | undefined, selected: boolean, setSelection: Dispatch<SetStateAction<Tx | null>>, tx: Tx } ) => {
    const value = tx.io.reduce( ( sum, _ ) => sum + ( _.value > 0 ? _.value : 0 ), 0 ) / 1e8
    const fees = tx.io.reduce( ( sum, _ ) => sum - _.value, 0 ) / 1e8
    return <div
        className={ [ styles.row, selected ? styles.selected : "" ].join( " " ) } onPointerEnter={ () => setSelection( tx ) }>
        <Hash seed={ tx.hash }/>
        <Tooltip content={ new Date( tx.time ).toLocaleString() }>
            <div className={ styles.time }><TimeAgo datetime={ tx.time }/></div>
        </Tooltip>
        <Amount amount={ value } price={ price }/>
        <Amount amount={ fees } price={ price }/>
        <div className={ styles.hashes }>{ unique( tx.io.filter( _ => _.value < 0 ).map( _ => _.address ) ).map( _ => <Hash key={ _ } seed={ _ } address/> ) }</div>
        <div className={ styles.hashes }>{ unique( tx.io.filter( _ => _.value > 0 ).map( _ => _.address ) ).map( _ => <Hash key={ _ } seed={ _ } address/> ) }</div>
    </div>
}

export const Rows = ( { prices, selection, setSelection, txs }: { prices: Price[], selection: Tx | null, setSelection: ComponentPropsWithoutRef<typeof Row>["setSelection"], txs: Tx[] } ) => <div className={ styles.rows }>
    <div className={ styles.header }>
        <div><Pill icon={ <IconHash/> }>Hash</Pill></div>
        <div><Pill icon={ <IconClock/> }>Time</Pill></div>
        <div><Pill icon={ <IconCoinsStacked02/> }>Amount</Pill></div>
        <div><Pill icon={ <IconCoinsHand/> }>Fees</Pill></div>
        <div><Pill icon={ <IconUser/> }>From</Pill></div>
        <div><Pill icon={ <IconArrowRight/> }>To</Pill></div>
    </div>
    { txs.map( tx => <Row
        key={ tx.hash }
        price={ ( prices.findLast( _ => _.time <= tx.time ) ?? prices[ 0 ] )?.price }
        selected={ selection?.hash === tx.hash }
        setSelection={ setSelection }
        tx={ tx }
    /> ) }
</div>
