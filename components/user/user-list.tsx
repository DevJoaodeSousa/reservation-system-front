'use client'
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui"

import { EllipsisVertical, Trash } from 'lucide-react';

import {
    Popover,
    Input,
    PopoverContent,
    PopoverTrigger,
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
    Card
} from "@/components/ui"
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { ListUser } from '@/app/__api/types'
import { excludeUserById, listUsers } from '@/app/__api/admin';

import { UserEditForm } from '@/components/user/user-edit'
import { UserAddForm } from './user-add';

export function UserList() {
    const { data: users, error, isLoading, refetch } = useQuery<ListUser[]>({
        queryKey: ['users'],
        queryFn: listUsers
    });

    if (isLoading) return <div className="flex flex-col w-full px-4 py-4 container"><p>Carregando...</p></div>
    if (error) return <div className="flex flex-col w-full px-4 py-4 container"><p>Erro ao carregar usuários</p></div>

    return (
        <div>
            <div className="flex flex-col w-full px-3 py-4 container">
                <div className='flex flex-row justify-between items-center mb-4'>
                    <h2 className='md:text-[28px] text-[22px] font-bold'>Usuários cadastrados</h2>
                    <div className='md:block hidden'>
                        <UserAddForm refetch={refetch} />
                    </div>
                </div>
                <TableUsers users={users || []} refetch={refetch} />
                <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                    <UserAddForm refetch={refetch} />
                </div>
            </div>
        </div>
    )
}


const TableUsers = ({ users, refetch, }: { users: ListUser[], refetch: () => void, }) => {
    if (!users) return <p>Carregando...</p>

    const [confirmation, setconfirmation] = useState('');
    const [openExclude, setOpenExclude] = useState(false)

    const handleExclude = async (id: string, confirmation: string) => {
        if (confirmation !== 'sim') {
            return
        }
        try {
            await excludeUserById(id)
            refetch()
        } catch (error: any) {
            console.log(error)
        }
    }
    return (
        <Card className='overflow-hidden'>
            <Table>
                <TableHeader >
                    <TableRow className='opacity-70'>
                        <TableHead >Nome</TableHead>
                        <TableHead >Telefone</TableHead>
                        <TableHead className='text-wrap min-w-[60px] '>Email</TableHead>
                        <TableHead >Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map(user => (
                        <TableRow key={user.email}>
                            <TableCell className='text-[12px] md:text-[18px] leading-none font-medium'>{user.name}</TableCell>
                            <TableCell className='text-[12px] md:text-[18px] leading-none font-medium'>{user.phone}</TableCell>
                            <TableCell className='text-wrap min-w-[60px] text-[12px] md:text-[18px] leading-none font-medium' style={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
                            <TableCell className=''>
                                <div className=' md:flex hidden gap-3 flex-row '>
                                    <Dialog open={openExclude} onOpenChange={setOpenExclude}>
                                        <DialogTrigger asChild >
                                            <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                                                <Trash size={24} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[455px]">
                                            <DialogHeader>
                                                <DialogTitle>Excluir usuário</DialogTitle>
                                                <DialogDescription>Tem certeza que quer excluir o usuário? Digite "sim" para confirmar</DialogDescription>
                                                <Input
                                                    id='confirmation'
                                                    label='Confirmação'
                                                    placeholder='Leia a mensagem acima'
                                                    value={confirmation}
                                                    onChange={(e) => setconfirmation(e.target.value)}
                                                />
                                            </DialogHeader>
                                            <DialogFooter className="border-t-2 pt-[16px]">
                                                <DialogClose asChild>
                                                    <Button onClick={() => handleExclude(user.user_id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <UserEditForm id={user.user_id} refetch={refetch} defaultValue={user} />
                                </div>
                                <div className='block md:hidden'>
                                    <Popover>
                                        <PopoverTrigger>
                                            <EllipsisVertical size={24} />
                                        </PopoverTrigger>
                                        <PopoverContent className='w-[144px] mr-4'>
                                            <div className='gap-2 flex flex-row items-center justify-center'>
                                                <Dialog open={openExclude} onOpenChange={setOpenExclude}>
                                                    <DialogTrigger asChild >
                                                        <Button variant='outline' className='w-[38px] h-[42px] rounded-lg'>
                                                            <Trash size={24} />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[455px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Excluir usuário</DialogTitle>
                                                            <DialogDescription>Tem certeza que quer excluir o usuário? Digite "sim" para confirmar</DialogDescription>
                                                            <Input
                                                                id='confirmation'
                                                                label='Confirmação'
                                                                placeholder='Leia a mensagem acima'
                                                                value={confirmation}
                                                                onChange={(e) => setconfirmation(e.target.value)}
                                                            />
                                                        </DialogHeader>
                                                        <DialogFooter className="border-t-2 pt-[16px]">
                                                            <DialogClose asChild>
                                                                <Button onClick={() => handleExclude(user.user_id, confirmation)} style={{ flexGrow: 1, padding: '25px 40px', borderRadius: 100 }} className="text-[18px] font-semibold ">Excluir usuário</Button>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <UserEditForm id={user.user_id} refetch={refetch} defaultValue={user} />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>


            </Table>

        </Card>
    )
}