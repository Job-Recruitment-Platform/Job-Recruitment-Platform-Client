export default function JobSavePage() {
   return (
      <div className='container my-7 grid min-h-screen !max-w-[1130px] grid-cols-3 gap-x-7 px-5'>
         <div className='col-span-2 rounded-lg'>
            {/*  Bannerr  */}
            <div
               className='flex h-[180px] items-center rounded-t-lg px-5'
               style={{
                  backgroundImage:
                     'linear-gradient(90deg, rgb(38, 50, 56), rgb(0, 177, 79) 105.53%)'
               }}
            >
               <div className='space-y-1.5 text-white'>
                  <div className='text-[24px] font-bold'>Việc làm đã lưu</div>
                  <p className='max-w-[588px] text-[15px] leading-5 text-wrap'>
                     Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để
                     không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
                  </p>
               </div>
            </div>

            {/*  Saved Jobs List  */}
            <div className='flex min-h-[316px] justify-center bg-white'>
               <div></div>
            </div>
         </div>
      </div>
   )
}
