import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'AICTE Student Data Platform | Prototype',description:'APAAR-linked student data management, admission monitoring and verification prototype for AICTE-approved institutions.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
