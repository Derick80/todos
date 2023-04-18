import TopNav from './top-nav'

export default function Layout({children}:{
    children: React.ReactNode
}){
    return (
        <div className='flex flex-col min-h-screen'>
            <TopNav />
            <div className='flex-grow'>
                {children}
            </div>
            <footer className='bg-gray-800 text-white text-center py-4'>
                <p>Footer</p>
            </footer>

        </div>

    )
}