import { TbFidgetSpinner } from 'react-icons/tb'

const LoadingSpinner = ({ smallHeight }) => {
    return (
        <div
            className={` ${smallHeight ? 'h-[250px]' : 'h-[70vh]'}
      flex 
      flex-col 
      justify-center 
      items-center `}
        >
            <TbFidgetSpinner size={100} color='lime' />
        </div>
    )
}

export default LoadingSpinner
