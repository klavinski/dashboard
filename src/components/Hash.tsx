import { hashColor, hashEmoji } from "../utils"
import styles from "./Hash.module.css"
import { Pill } from "./Pill"
import { Tooltip } from "./Tooltip"

export const Hash = ( { address, seed }: { address?: true, seed: string } ) => <Tooltip content={ seed }>
    <a
        className={ styles.container }
        href={ seed === "?????" ? undefined : `https://blockchain.com/${ address ? "btc/address" : "explorer/transactions/btc" }/${ seed }` }
        target="_blank"
    >
        <Pill icon={ address && hashEmoji( seed ) } backgroundColor={ hashColor( seed ) }>{ seed.slice( - 5 ) }</Pill>
    </a>
</Tooltip>
