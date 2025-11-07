import { JobSearchResult, JobType } from '@/types/job.type'
import { OptionType } from '@/types/option.type'

export const experienceOptions: OptionType[] = [
   { label: 'Tất cả', value: '' },
   { label: '1 Năm', value: '1' },
   { label: '2 Năm', value: '2' },
   { label: '3 Năm', value: '3' },
   { label: '4 Năm', value: '4' },
   { label: '5 Năm', value: '5' },
   { label: '6 Năm', value: '6' },
   { label: '7 Năm', value: '7' },
   { label: '8 Năm', value: '8' },
   { label: '9 Năm', value: '9' },
   { label: '10 Năm', value: '10' }
]

export const levelOptions: OptionType[] = [
   { label: 'Tất cả', value: '' },
   { label: 'Intern', value: 'INTERN' },
   { label: 'Fresher', value: 'FRESHER' },
   { label: 'Junior', value: 'JUNIOR' },
   { label: 'Middle', value: 'MIDDLE' },
   { label: 'Senior', value: 'SENIOR' },
   { label: 'Leader', value: 'LEADER' }
]

export const workModeOptions: OptionType[] = [
   { label: 'Tất cả', value: '' },
   { label: 'Toàn thời gian', value: 'FULL-TIME' },
   { label: 'Bán thời gian', value: 'PART-TIME' },
   { label: 'Làm việc từ xa', value: 'REMOTE' },
   { label: 'Thực tập', value: 'INTERNSHIP' }
]

export const jobMockData: JobType[] = [
   {
      id: 1,
      title: 'Senior Backend Developer (NodeJS, Python)',
      logo: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/ngan-hang-tmcp-viet-nam-thinh-vuong-vpbank-63e1cb5539e62.jpg',
      company: 'Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
      location: 'Hồ Chí Minh',
      salary: 'Thoả thuận'
   },
   {
      id: 2,
      title: 'Kỹ Sư Điện - Dự Án SamSung Thái Nguyên (Thu Nhập 20 - 30 Triệu)',
      logo: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/zcUVlhXwepdx4gWnjk8yYqM6lJtsRSYW_1753242647____c46806c77b7b0107280c2cbabf7bbc5c.jpg',
      company: 'CÔNG TY TNHH ĐẦU TƯ VÀ THI CÔNG ĐIỆN VIỆT PHÁT',
      location: 'TP. Hồ Chí Minh',
      salary: '20 - 30 triệu'
   },
   {
      id: 3,
      title: 'Kỹ Sư Quản Lý Chất Lượng QA/QC Site Quality (Kiểm Soát Đảm Bảo Chất Lượng Xây Dựng)',
      logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/68d376700b0991758688880.png',
      company: 'CÔNG TY TNHH SINH NAM METAL (VIỆT NAM)',
      location: 'Hồ Chí Minh',
      salary: 'Thoả thuận'
   },
   {
      id: 4,
      title: 'Nhân Viên Kế Toán Tổng Hợp (Thu Nhập Từ 13-18 Triệu/Tháng) Tại Hà Nội',
      logo: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/uq3QiGfly0c76vFTg9IaPctKlbhupA06_1658484856____926f7d6c7616b260309917bfdda60ee8.png',
      company: 'CÔNG TY TNHH CÔNG NGHỆ GIÁO DỤC FIDUTECH',
      location: 'Hà Nội',
      salary: '13 - 18 triệu'
   },
   {
      id: 5,
      title: 'Nhân Viên SEO Google Tại Tân Phú - Thu Nhập Từ 10 -30 Triệu',
      logo: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-tnhh-lenart-d0de51ce1f5bbb8bd4f86e29a5cf6855-67b581566a6c4.jpg',
      company: 'CÔNG TY TNHH LENART',
      location: 'Tân Phú',
      salary: '10 - 30 triệu'
   },
   {
      id: 6,
      title: 'Nhân Viên QC/QS Xây Dựng Tại Thanh Xuân/ Hà Đông - Hà Nội',
      logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dau-tu-va-thuong-mai-quoc-te-huy-hoang-fca21efa77c95bd269a065b307e6df2e-674eb914f06cd.jpg',
      company: 'CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ THƯƠNG MẠI QUỐC TẾ HUY HOÀNG',
      location: 'Hà Nội',
      salary: 'Thỏa thuận'
   },
   {
      id: 7,
      title: 'Kiến Trúc Sư Chủ Trì Kiến Trúc',
      logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/Y5sUupd6Sa84euAmd3xNe0OqJEPomzvv_1748327136____275ca2cfeaae9db33c8ef743a9018157.png',
      company: 'CÔNG TY CP THIẾT KẾ THI CÔNG XÂY DỰNG VÀ NỘI THẤT ĐƯỜNG THỊNH',
      location: 'Hồ Chí Minh',
      salary: 'Từ 15 triệu'
   },
   {
      id: 8,
      title: 'Kỹ Thuật Viên FPT Telecom - Bình Chánh - Đào Tạo Bài Bản - Phỏng Vấn Đi Làm Ngay',
      logo: 'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/cong-ty-co-phan-vien-thong-fpt-5d5f5980e317c.jpg',
      company: 'Công ty Cổ phần viễn thông FPT',
      location: 'Hồ Chí Minh',
      salary: '10 - 18 triệu'
   },
   {
      id: 9,
      title: 'Marketing Executive',
      logo: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/MlecjomTzvVVDd8eUp26Edyg1GUfZxpR_1706237320____c7c79d255d1400c5ceddc06d83814600.png',
      company: 'SCI Group',
      location: 'Hà Nội',
      salary: '15 - 20   triệu'
   }
]

export const mockJobSearchResult: JobSearchResult[] = [
   {
      id: 1,
      logo: 'https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/YKksZdqoHhIgbSJwN0d5Byim9I6kBWuG_1707983415____0b8facb24f743dfadd49211d21495fa9.jpg',
      title: 'Kỹ Sư Lập Trình Nhúng (C/C++)',
      company: 'Công ty TNHH Công Nghệ Dicom',
      location: 'Hà Nội',
      jobRole: 'Backend Developer',
      seniority: 'SENIOR',
      minExperienceYears: 1,
      workMode: 'ONSITE',
      salaryMin: 10,
      salaryMax: 15,
      currency: 'triệu',
      datePosted: 123,
      dateExpires: 123,
      status: 'PUBLISHED',
      skills: []
   },
   {
      id: 2,
      logo: 'https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/9elArcuygLjya82ubvJl0ctJpvEzQZY1_1687320656____2e355c0a67075b013b977e886d88ce7d.jpeg',
      title: 'BackEnd Developer',
      company: 'Cty Cổ Phần Warppipe',
      location: 'Hà Nội',
      jobRole: 'Backend Developer',
      seniority: 'SENIOR',
      minExperienceYears: 3,
      workMode: 'ONSITE',
      salaryMin: 18,
      salaryMax: 30,
      currency: 'triệu',
      datePosted: 123,
      dateExpires: 123,
      status: 'PUBLISHED',
      skills: []
   },
   {
      id: 3,
      logo: 'https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/ngan-hang-tmcp-viet-nam-thinh-vuong-vpbank-63e1cb5539e62.jpg',
      title: 'Backend (Java) Developer',
      company: 'Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
      location: 'Hồ Chí Minh',
      jobRole: 'Backend Developer',
      seniority: 'SENIOR',
      minExperienceYears: 4,
      workMode: 'ONSITE',
      salaryMin: 25,
      salaryMax: 40,
      currency: 'triệu',
      datePosted: 123,
      dateExpires: 123,
      status: 'PUBLISHED',
      skills: []
   },
   {
      id: 4,
      logo: 'https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/porters-asia-vietnam-company-limited-e2a86b01cb08722dd97ea14c0e5219c2-66987cccbffaf.jpg',
      title: 'Middle/Senior Frontend Engineer(ReactJS,Fullstack)',
      company: 'PORTERS ASIA VIETNAM COMPANY LIMITED',
      location: 'Hồ Chí Minh',
      jobRole: 'Backend Developer',
      seniority: 'SENIOR',
      minExperienceYears: 4,
      workMode: 'ONSITE',
      salaryMin: 25,
      salaryMax: 50,
      currency: 'triệu',
      datePosted: 123,
      dateExpires: 123,
      status: 'PUBLISHED',
      skills: []
   }
]
