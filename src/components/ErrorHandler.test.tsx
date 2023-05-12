import { describe, expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { ComponentPropsWithoutRef } from "react"
import { ErrorHandler } from "./ErrorHandler"

const makeErrorHandlerWithError = ( error: ComponentPropsWithoutRef<typeof ErrorHandler>["response"]["error"] ) => <ErrorHandler response={ { data: "response data", error } }>{ data =>
    <div>Displaying { data }</div>
}</ErrorHandler>

describe( "ErrorHandler", () => {
    test( "Show the children using the response data when there are no errors", () => {
        render( makeErrorHandlerWithError( null ) )
        expect( screen.queryByText( "Displaying response data" ) ).not.toBeNull()
        expect( screen.queryByText( /error message/ ) ).toBeNull()
    } )
    test( "Show the error message when there is one", () => {
        render( makeErrorHandlerWithError( new Error( "error message" ) ) )
        expect( screen.queryByText( "Displaying response data" ) ).toBeNull()
        expect( screen.queryByText( /error message/ ) ).not.toBeNull()
    } )
} )
