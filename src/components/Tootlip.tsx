import { autoUpdate, flip, shift, useFloating, useHover, useInteractions } from "@floating-ui/react"
import { ReactNode, useState } from "react"
import styles from "./Tooltip.module.css"
import { createPortal } from "react-dom"

export const Tooltip = ( { children, content }: { children: ReactNode, content: ReactNode } ) => {
    const [ isOpen, setIsOpen ] = useState( false )
    const { refs, floatingStyles, context } = useFloating( {
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: ( ...args ) => autoUpdate( ...args, { animationFrame: true } ),
        middleware: [ shift(), flip() ]
    } )

    const hover = useHover( context )

    const { getReferenceProps, getFloatingProps } = useInteractions( [ hover ] )

    return <>
        <div ref={ refs.setReference } { ...getReferenceProps() }>
            { children }
        </div>
        { isOpen && createPortal( <div className={ styles.floating } ref={ refs.setFloating } { ...getFloatingProps() } style={ floatingStyles }>
            { content }
        </div>, document.body ) }
    </>
}
