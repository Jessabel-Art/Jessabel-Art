// Production integration boundary. Replace this adapter with an HTTPS endpoint.
// The server must validate fields and file signatures, enforce upload limits,
// rate-limit submissions, and implement secure storage and delivery.
// Demo mode intentionally transmits and persists no personal information.
export async function submitQuote(payload){await new Promise(resolve=>setTimeout(resolve,650));if(!payload||!payload.name)throw new Error('Missing request information.');return {mode:'demo',received:true};}
