import { Input } from "@/components/ui/input.jsx";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { DotIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {useDispatch, useSelector} from "react-redux";
import { selectUserWalletDetails } from "@/Redux/Slice/Wallet/WalletSlice.js";
import { selectAssets } from "@/Redux/Slice/Asset/AssetSlice.js";
import {createOrderPayment, fetchAllOrdersForUser} from "@/Redux/AsyncThunk/Order/OrderAsyncThunk.js";
import {getUserWalletDetails, getUserWalletTransactions} from "@/Redux/AsyncThunk/Wallet/WalletAsyncThunk.js";
import {getAllUserAssets} from "@/Redux/AsyncThunk/Asset/AssetAsyncThunk.js";

export const TradingForm = ({ coinDetailsByCoinId,closeDialog }) => {
    const [orderType, setOrderType] = useState('SELL');
    const [amount, setAmount] = useState('');
    const walletDetails = useSelector(selectUserWalletDetails);
    const userAssets = useSelector(selectAssets);
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState('');


    const currentPrice = coinDetailsByCoinId.current_price || coinDetailsByCoinId.market_data.current_price.usd;

    const userAsset = userAssets.find(asset => asset.coin.id === coinDetailsByCoinId.id);
    const userBalance = walletDetails.balance || 0;
    const userAssetQuantity = userAsset ? userAsset.quantity : 0;

    const handleChange = (event) => {
        setAmount(event.target.value);
    };

    const handleBuy = async () => {
        if (amount <= 0 || amount > (userBalance / currentPrice)) {
            alert('Invalid amount');
            return;
        }

        try {
            const result = await dispatch(createOrderPayment({
                coinId: coinDetailsByCoinId.id,
                quantity: parseFloat(amount),
                orderType: 'BUY',
            })).unwrap();

            if (result) {
                console.log('Order Placed successfully:', result);
                dispatch(getUserWalletDetails());
                dispatch(getUserWalletTransactions());
                dispatch(getAllUserAssets());
                dispatch(fetchAllOrdersForUser());
                closeDialog();
            }
        } catch (error) {
            console.error('Failed to purchase asset:', error);
            setErrorMessage('Failed to purchase asset. Please try again.');
        }
    };


    const handleSell = async () => {
        if (amount <= 0 || amount > userAssetQuantity) {
            alert('Invalid amount');
            return;
        }

        try {
            const result = await dispatch(createOrderPayment({
                coinId: coinDetailsByCoinId.id,
                quantity: parseFloat(amount),
                orderType: 'SELL',
            })).unwrap();

            if (result) {
                console.log('Selling order placed successfully:', result);
                dispatch(getUserWalletDetails());
                dispatch(getUserWalletTransactions());
                dispatch(getAllUserAssets());
                dispatch(fetchAllOrdersForUser());
                closeDialog();
            }
        } catch (error) {
            console.error('Failed to sell asset:', error);
            setErrorMessage('Failed to sell asset. Please try again.');
        }
    };



    const maxBuyableQuantity = userBalance / currentPrice;
    const maxSellableQuantity = userAssetQuantity;

    const isBuyDisabled = orderType === 'BUY' && amount > maxBuyableQuantity;
    const isSellDisabled = orderType === 'SELL' && amount > maxSellableQuantity;

    return (
        <div className='space-y-10 p-5'>
            <div className='flex gap-4 items-center justify-between'>
                <Input
                    className='py-3 px-4 h-14 border rounded-md focus:outline-none'
                    placeholder={`Enter ${orderType === 'BUY' ? 'Amount to Buy' : 'Quantity to Sell'}...`}
                    onChange={handleChange}
                    type='number'
                    name='amount'
                    value={amount}
                />
                <div className='flex justify-center items-center border text-2xl w-36 h-14 rounded-md'>
                    {orderType === 'BUY' ? `$${userBalance}` : `${userAssetQuantity}`}
                </div>
            </div>
            {isBuyDisabled && <h1 className='text-red-600 mt-3 text-center'>Insufficient Wallet Balance</h1>}
            {isSellDisabled && <h1 className='text-red-600 mt-3 text-center'>Insufficient Asset Quantity</h1>}

            <div className='flex gap-5 mt-4 items-center'>
                <Avatar>
                    <AvatarImage
                        src={coinDetailsByCoinId.image.large || coinDetailsByCoinId.image || coinDetailsByCoinId.large}
                        alt={coinDetailsByCoinId.name}
                    />
                </Avatar>
                <div>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold'>{coinDetailsByCoinId.symbol.toUpperCase()}</p>
                        <DotIcon className='text-gray-400'/>
                        <p className='text-gray-400'>{coinDetailsByCoinId.name}</p>
                    </div>
                    <div className='flex items-baseline gap-2 mt-1'>
                        <p className='text-xl font-bold'>${currentPrice}</p>
                        <p className={coinDetailsByCoinId.price_change_24h < 0 ? 'text-red-600' : 'text-green-500'}>
                            {coinDetailsByCoinId.price_change_24h || coinDetailsByCoinId.market_data.price_change_24h_in_currency.usd}
                            {` (${coinDetailsByCoinId.price_change_percentage_24h || coinDetailsByCoinId.market_data.price_change_percentage_24h}%)`}
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-between mt-4'>
                <p>{orderType === 'BUY' ? "Available Cash" : "Available Quantity"}</p>
                <p>{orderType === 'BUY' ? `$${userBalance}` : userAssetQuantity}</p>
            </div>

            <div>
                {orderType === 'BUY' ? (
                    <div>
                        <Button className='w-full py-6' onClick={handleBuy}>Buy</Button>
                        <Button variant='link' onClick={() => setOrderType('SELL')} className='w-full mt-4'>Or
                            Sell</Button>
                    </div>
                ) : (
                    <div>
                        <Button className='w-full bg-red-600 py-6 text-white' onClick={handleSell}>Sell</Button>
                        <Button variant='link' onClick={() => setOrderType('BUY')} className='w-full mt-4'>Or
                            Buy</Button>
                    </div>
                )}
            </div>
            {errorMessage}
        </div>
    );
};
