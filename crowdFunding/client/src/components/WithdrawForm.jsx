import React from "react";
import CustomButton from "./CustomButton";

const WithdrawForm = ({balance=0, amount, handleOnChange, handleWithdraw }) => {
    return (
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Withdraw
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Withdraw your funds
            </p>
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-[#808191]">Your balance: 
                <span> {balance} </span> ETH
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={handleOnChange}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Thanks for your sharing.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  See you in the next campaign.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Withdraw Funds"
                styles="w-full bg-[#FFA500]"
                handleClick={handleWithdraw}
              />
            </div>
          </div>
        </div>
    )
}

export default WithdrawForm