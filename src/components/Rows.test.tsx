import { describe, expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { Rows } from "./Rows"
import { ComponentPropsWithoutRef } from "react"
import styles from "./Rows.module.css"

const testTxs = [
    { hash: "Transaction", time: 1e12, io: [ { address: "source", value: - 4e8 }, { address: "target", value: 1e8 } ] }
]

const TestRows = ( props: Partial<ComponentPropsWithoutRef<typeof Rows>> ) => <Rows
    prices={ [ { price: 0, time: 0 }, { price: 5, time: 1 }, { price: 0, time: 1e12 + 1 } ] }
    txs={ testTxs }
    selection={ null }
    setSelection={ () => null }
    { ...props }
/>

describe( "Rows", () => {
    test( "Show the transaction using the latest price before the transaction", async () => {
        render( <TestRows/> )
        expect( screen.getByText( "ction" ) ).not.toBeNull() // Hash
        expect( screen.getByText( "ource" ) ).not.toBeNull() // Source
        expect( screen.getByText( "arget" ) ).not.toBeNull() // Target
        expect( screen.getByText( "15.00" ) ).not.toBeNull() // Amount in USD
        expect( screen.getByText( "3.00" ) ).not.toBeNull() // Amount in USD
        expect( screen.getByText( "5.00" ) ).not.toBeNull() // Fees in USD
        expect( screen.getByText( "1.00" ) ).not.toBeNull() // Fees in USD
    } )
    test( "Add a specific style to the selected transaction", () => {
        expect( render( <TestRows/> ).container.querySelector( `.${ styles.selected }` ) ).toBeNull()
        expect( render( <TestRows selection={ testTxs[ 0 ] }/> ).container.querySelector( `.${ styles.selected }` ) ).not.toBeNull()
    } )
    test( "Display '?' while there are no prices", () => {
        render( <TestRows/> )
        expect( screen.queryAllByText( "?" ).length ).toBe( 0 )
        render( <TestRows prices={ [] }/> )
        expect( screen.queryAllByText( "?" ).length ).greaterThanOrEqual( 1 )
    } )
} )
