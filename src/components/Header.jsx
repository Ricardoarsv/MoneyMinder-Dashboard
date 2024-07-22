import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header(){

    return(
        <>
            <div className='flex flex-row justify-between items-center px-8 mx-12 h-10 bg-accentPalette rounded-ee-3xl rounded-es-3xl'>
                
                <h1 className='text-textAccentPalette text-1xl font-bold'>Finantial Management</h1>
                <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </>
    )   
}