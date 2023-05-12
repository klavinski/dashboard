import { Hct } from "@material/material-color-utilities"

export const unique = <T>( _: T[] ) => Array.from( new Set( _ ) )

export const hash = ( seed: string ): number => [ ...seed ].map( _ => _.charCodeAt( 0 ) ).reduce( ( a, b ) => a + b, 0 ) % 128

export const red = "#c40233"
export const green = "#009f6b"
const gray = "#eee"


const color = ( ...hct: Parameters<typeof Hct["from"]> ) => `#${ Hct.from( ...hct ).toInt().toString( 16 ).slice( 2 ) }`

export const hashColor = ( seed: string ) => seed === "?????" ? gray : color( hash( seed ) / 128 * 360, 80, 90 )

const emojis = "🐶 🐱 🐭 🐹 🐰 🦊 🐼 🐨 🐯 🦁 🐷 🐸 🐵 🐦 🐤 🐣 🐥 🦆 🦅 🐺 🐴 🦄 🐝 🪱 🐛 🦋 🐌 🐞 🐜 🪰 🪲 🪳 🦗 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🦓 🦍 🦧 🦣 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐎 🐖 🐑 🦙 🐐 🦌 🐕 🦮 🐕‍🦺 🐈 🐈‍⬛ 🦃 🦤 🦩 🐇 🦝 🦨 🦡 🦫 🦥 🐀 🐿 🦔".split( " " )

export const hashEmoji = ( seed: string ) => seed === "?????" ? "🔒" : emojis[ hash( seed ) % emojis.length ]
