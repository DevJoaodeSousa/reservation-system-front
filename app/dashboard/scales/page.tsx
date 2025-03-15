'use client'
import { Card } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
 
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button
} from "@/components/ui/"

import { Trash, EllipsisVertical, Captions, Copy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'


import { ScaleAdd } from "@/components/scale/scale-add";
import { deleteScale, duplicateScale, listMyScales, listScales } from "@/app/__api/scale";
import { ListScale } from "@/app/__api/types";
import { ScaleShow } from "../../../components/scale/scale-show";
import { ScaleEdit } from "../../../components/scale/scale-edit";

export default function ScalesPage() {

    const { data: scales, error, isLoading, refetch } = useQuery({
        queryKey: ['scales list'],
        queryFn: listScales,
    });

    const { data: myscales, error: myerror, isLoading: myloading, refetch: myrefetch } = useQuery({
        queryKey: ['my scales list'],
        queryFn: listMyScales,
    });

    return (
        <div className="z-0 mx-auto py-6 container">
            <Tabs defaultValue="all" className="w-full px-3">
                <div className='justify-between flex-row flex w-full'>
                    <div className='flex-row flex gap-2 mx-auto md:mx-1'>
                        <TabsList>
                            <TabsTrigger value="all">Escalas</TabsTrigger>
                            <TabsTrigger value="my">Minhas escalas</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="md:block hidden">
                        <ScaleAdd refetch={refetch} />
                    </div>
                </div>
                <TabsContent value="all">
                    <ScaleItem data={scales || []} refetch={refetch} />
                </TabsContent>
                <TabsContent value="my">
                    <ScaleItem data={myscales || []} refetch={myrefetch} />
                </TabsContent>
            </Tabs>
            <div style={{ height: 150, }}></div>
            <div style={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translateX(-50%)' }} className='justify-center items-center md:hidden'>
                <ScaleAdd refetch={refetch} />
            </div>
        </div>
    )
}

const ScaleItem = ({ data, refetch, }: { data: ListScale[], refetch: () => void, }) => {
    if (data?.length === 0) return <div className='flex flex-row items-center gap-6 border p-6 justify-center rounded-xl my-6'>
        <div className='flex flex-col justify-center items-center gap-2'>
            <Captions size={64} />
            <h2 className='text-[24px] font-bold text-center' style={{ lineHeight: 1, }}>Não encontramos nenhuma escala</h2>
            <span className='opacity-70 text-[18px] text-center'>Sem escalas criadas por enquanto...</span>
        </div>
    </div>
    const handleExclude = async (id: string) => {
        try {
            await deleteScale(id);
            refetch()
        } catch (error) {
            console.log(error)
        }
    }
    const handleDuplicate = async (id: string) => {
        try {
            await duplicateScale(id);
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    const Actions = ({ id, scale }: { id: string, scale: any }) => {
        return (
            <div className='gap-2 flex flex-row items-center justify-center'>
                <Button variant="outline" className="h-12 w-12" onClick={() => handleExclude(id)}>
                    <Trash className="h-16 w-16" />
                </Button>
                <Button variant="outline" className="h-12 w-12" onClick={() => handleDuplicate(id)}>
                    <Copy className="h-16 w-16" />
                </Button>
                <ScaleEdit id={id} refetch={refetch} defaultValues={scale} />
            </div>
        )
    }

    if (!data) return <div>Carregando...</div>
    return (
        <div className='gap-8'>
            {data?.map((scale: ListScale) => {
                const { id, name, direction, date, confirmations } = scale
                return (
                    <Card key={id} className="md:p-4 p-2   my-4">
                        <div className='flex flex-row items-center gap-2 justify-between mb-4'>
                            <div className='flex-col flex px-2 py-4 gap-2 sm:px-0 sm:py-0'>
                                <span className='text-[18px] md:text-[24px] md:leading-[24px] leading-[12px] font-bold mb-2'>{name}</span>
                                <div className='flex-row flex gap-2'>
                                    <span className="px-4 py-2 text-[12px] md:text-[16px] border-amber-500 text-amber-500 border-2 font-semibold rounded-full">{date.slice(0, 5)}</span>
                                    <span className="px-4 pb-2 pt-[9px] text-[12px] md:text-[16px]  bg-amber-500 text-white font-semibold rounded-full">{direction.name.length > 16 ? direction.name.slice(0, 16) + '...' : direction.name}</span>
                                </div>
                            </div>
                            <div className="hidden md:flex">
                                <Actions id={id} scale={scale} />
                            </div>
                            <div className='md:hidden border w-[46px] mr-2 h-[46px] rounded-lg items-center justify-center flex'>
                                <Popover>
                                    <PopoverTrigger>
                                        <EllipsisVertical size={24} />
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[204px] mr-4'>
                                        <Actions id={id} scale={scale} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <ScaleShow id={id} />
                    </Card >
                )
            }
            )}
        </div>

    )
}