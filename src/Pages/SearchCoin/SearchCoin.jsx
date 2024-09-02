import React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {ShuffleIcon} from "lucide-react";
import {AvatarImage} from "@radix-ui/react-avatar";
import {BiCoin} from "react-icons/bi";
import {useNavigate} from "react-router-dom";

export const SearchCoin=({ coin,onClose })=>{
    const navigate=useNavigate();
    return (
        <Card className='px-5 py-3 flex justify-between border-none w-full items-center'>
            <div className='flex items-center flex-grow'>
                <div className='flex-shrink-0 w-[25%]'>
                    <Avatar >
                        <AvatarImage
                            onClick={()=>{
                                onClose();
                                navigate(`/market/${coin?.id}`);
                            }
                        }
                            className="rounded-full cursor-pointer"
                            src={
                                coin.thumb
                            }
                            alt={`Coin Logo`}
                        />
                        <AvatarFallback>
                            <BiCoin />
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex-grow w-[50%]'>
                    <h1 className='text-lg font-semibold truncate'>{coin.symbol}</h1>
                    <p className='text-sm text-gray-500'>{coin.name}</p>
                </div>
            </div>
        </Card>
    );
}

