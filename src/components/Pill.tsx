import { ReactNode } from "react"
import styles from "./Pill.module.css"

export const Pill = ( { backgroundColor, children, icon }: { backgroundColor?: string, children: ReactNode, icon?: ReactNode } ) => <div
    className={ styles.container }
    style={ { backgroundColor } }
>
    { icon && <div className={ styles.icon }>{ icon }</div> }
    { children }
</div>
