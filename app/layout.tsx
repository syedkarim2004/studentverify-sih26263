import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'StudentVerify | Admission Intelligence',description:'APAAR-linked student records, admission validation and discrepancy review. SIH26263 working prototype.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
