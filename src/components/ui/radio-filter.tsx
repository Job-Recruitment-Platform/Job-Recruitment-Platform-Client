import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { OptionType } from '@/types/option.type'
import { cx } from 'class-variance-authority'

type RadioFilterProps = {
   header: string
   className?: string
   columns: 1 | 2
   options: OptionType[]
}

const RadioItem = ({ option }: { option: OptionType }) => (
   <div className='flex items-center gap-x-2'>
      <RadioGroupItem className='border-2' value={option.value} id={option.value} />
      <Label className='text-black/70' htmlFor={option.value}>
         {option.label}
      </Label>
   </div>
)

export default function RadioFilter({ className, columns = 1, options, header }: RadioFilterProps) {
   const splitOptions = (opts: OptionType[]) => {
      const mid = Math.ceil(opts.length / 2)
      return [opts.slice(0, mid), opts.slice(mid)]
   }

   const [col1, col2] = columns === 2 ? splitOptions(options) : [options, []]

   return (
      <div className={cx(className)}>
         <div className='py-3 text-sm font-semibold'>{header}</div>
         <RadioGroup>
            <div className={columns === 2 ? 'grid w-fit grid-cols-2 space-x-10' : 'space-y-1'}>
               <div className='space-y-3'>
                  {col1.map((opt) => (
                     <RadioItem key={opt.value} option={opt} />
                  ))}
               </div>
               {col2.length > 0 && (
                  <div className='space-y-3'>
                     {col2.map((opt) => (
                        <RadioItem key={opt.value} option={opt} />
                     ))}
                  </div>
               )}
            </div>
         </RadioGroup>
      </div>
   )
}
