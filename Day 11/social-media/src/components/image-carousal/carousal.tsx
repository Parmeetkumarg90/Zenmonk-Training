import Image from 'next/image';

const Carousal = ({ list }: { list: string[] }) => {
    console.log(list)
    return (
        <>
            {
                list.map((img) => <Image src={img} width={200} height={200} alt={img} key={}/>)
            }
        </>
    )
}

export default Carousal