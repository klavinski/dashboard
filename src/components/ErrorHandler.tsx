import { ReactNode } from "react"
import styles from "./ErrorHandler.module.css"

export const ErrorHandler = <T, >( { children, response }: { children: ( data: T ) => ReactNode, response: { data: T, error: Error | null } } ) =>
    response.error ? <div className={ styles.container }>⚠️ Error: { response.error.message }</div> : <>{ children( response.data ) }</>
