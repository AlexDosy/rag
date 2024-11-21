import "./global.css"

export const metadat ={
    title: "F1GPT",
    description:"the place to go for all your Formula one questions"
}

const RootLayout =({children}) =>{
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout