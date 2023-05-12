import { describe, expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { Hash } from "./Hash"

describe( "Hash", () => {
    test( "Show only the last 5 characters", () => {
        const hash = "Long hash, of which only the last 5 characters should be visible"
        render( <Hash seed={ hash }/> )
        expect( screen.queryByText( hash ) ).toBeNull()
        expect( screen.queryByText( hash.slice( - 5 ) ) ).not.toBeNull()

    } )
    test( "Correctly link to blockchain.com transactions", () => {
        const hash = "hash"
        expect( render( <Hash seed={ hash }/> ).container.querySelector( "a" )?.getAttribute( "href" ) ).toBe( `https://blockchain.com/explorer/transactions/btc/${ hash }` )
    } )
    test( "Correctly link to blockchain.com addresses", () => {
        const hash = "hash"
        expect( render( <Hash seed={ hash } address/> ).container.querySelector( "a" )?.getAttribute( "href" ) ).toBe( `https://blockchain.com/btc/address/${ hash }` )
    } )
    test( "Do not link when the address is unknown", () => {
        const hash = "?????"
        render( <Hash seed="?????" address/> )
        const element = screen.queryByText( hash )
        expect( element ).not.toBeNull()
        expect( screen.queryByText( hash )?.querySelector( "a" )?.getAttribute( "href" ) ).toBeUndefined()
    } )
} )
