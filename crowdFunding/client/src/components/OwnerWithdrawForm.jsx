import React from "react";
import CustomButton from "./CustomButton";

const OwnerWithdrawForm = ({balance=0, handleWithdraw }) => {
    return (
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Withdraw
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Withdraw your funds
            </p>
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-[#808191]">Campaign balance: 
                <span> {balance} </span> ETH
            </p>
            <div className="mt-[30px]">

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Withdraw your campaign an boots your dreams up!!
                </h4>
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

export default OwnerWithdrawForm