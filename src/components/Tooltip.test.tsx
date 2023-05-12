import { describe, expect, test } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Tooltip } from "./Tooltip"
import ResizeObserverModule from "resize-observer-polyfill"
global.ResizeObserver = ResizeObserverModule

describe( "Tooltip", () => {
    test( "Display the tooltip only on hover", async () => {
        render( <Tooltip content="tooltip content">Text to hover</Tooltip> )
        expect( await screen.findByText( "Text to hover" ) ).not.toBeNull()
        expect( screen.queryByText( "tooltip content" ) ).toBeNull()
        fireEvent.mouseEnter( screen.getByText( "Text to hover" ) )
        expect( await screen.findByText( "tooltip content" ) ).not.toBeNull()
        fireEvent.mouseLeave( screen.getByText( "Text to hover" ) )
        expect( screen.queryByText( "tooltip content" ) ).toBeNull()
    } )
} )
