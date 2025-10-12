import { type LucideProps } from 'lucide-react'

type FilledIconProps = {
   icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
   >
   fill?: string
   fillColor?: 'primary' | 'google' | 'facebook' | 'linkedin'
   size?: number
   strokeWidth?: number
}

const fillColorMap = {
   primary: 'var(--color-primary-green)',
   google: 'var(--color-google-red)',
   facebook: 'var(--color-facebook-blue)',
   linkedin: 'var(--color-linkedin-blue)'
}

export default function FilledIcons({
   icon: Icon,
   fill,
   fillColor = 'primary',
   size,
   strokeWidth
}: FilledIconProps) {
   const finalFill = fill || fillColorMap[fillColor]

   return (
      <div className='relative'>
         <div>
            <Icon fill={finalFill} color='white' size={size} />
         </div>
         <div className='absolute top-0'>
            <Icon color='white' size={size} strokeWidth={strokeWidth} />
         </div>
      </div>
   )
}
