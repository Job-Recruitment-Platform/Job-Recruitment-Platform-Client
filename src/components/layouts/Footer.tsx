import Link from 'next/link'
import { Facebook, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
	return (
		<footer className='mt-10 border-t bg-white'>
			<div className='container mx-auto py-10'>
				<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
					<div className='space-y-3'>
						<div className='text-base font-semibold'>BotCV</div>
						<p className='text-sm text-gray-600'>
							Nền tảng kết nối ứng viên và nhà tuyển dụng, giúp bạn tìm kiếm cơ hội
							nghề nghiệp phù hợp nhanh chóng.
						</p>
						<div className='flex items-center gap-3'>
							<Link href='#' className='rounded-full border p-2 text-gray-600 hover:text-primary'>
								<Facebook size={16} />
							</Link>
							<Link href='#' className='rounded-full border p-2 text-gray-600 hover:text-primary'>
								<Linkedin size={16} />
							</Link>
							<Link href='mailto:contact@BotCV.vn' className='rounded-full border p-2 text-gray-600 hover:text-primary'>
								<Mail size={16} />
							</Link>
						</div>
					</div>

					<div className='space-y-3'>
						<div className='text-base font-semibold'>Dành cho ứng viên</div>
						<ul className='space-y-2 text-sm text-gray-600'>
							<li><Link href='/search' className='hover:text-primary'>Tìm kiếm việc làm</Link></li>
							<li><Link href='/(candidate)/profile' className='hover:text-primary'>Hồ sơ của tôi</Link></li>
							<li><Link href='/job/save' className='hover:text-primary'>Việc làm đã lưu</Link></li>
						</ul>
					</div>

					<div className='space-y-3'>
						<div className='text-base font-semibold'>Dành cho nhà tuyển dụng</div>
						<ul className='space-y-2 text-sm text-gray-600'>
							<li><Link href='/recruiter/dashboard' className='hover:text-primary'>Bảng điều khiển</Link></li>
							<li><Link href='/recruiter/job/create' className='hover:text-primary'>Đăng tin tuyển dụng</Link></li>
							<li><Link href='/recruiter/register' className='hover:text-primary'>Đăng ký nhà tuyển dụng</Link></li>
						</ul>
					</div>

					<div className='space-y-3'>
						<div className='text-base font-semibold'>Về chúng tôi</div>
						<ul className='space-y-2 text-sm text-gray-600'>
							<li><Link href='#' className='hover:text-primary'>Giới thiệu</Link></li>
							<li><Link href='#' className='hover:text-primary'>Điều khoản sử dụng</Link></li>
							<li><Link href='#' className='hover:text-primary'>Chính sách bảo mật</Link></li>
						</ul>
					</div>
				</div>

				<div className='mt-10 border-t pt-6 text-center text-xs text-gray-500'>
					© {new Date().getFullYear()} BotCV. All rights reserved.
				</div>
			</div>
		</footer>
	)
}
