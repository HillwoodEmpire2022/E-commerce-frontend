
const ProductsSection = (props) => {
    return (
        <div className={`w-full py-16 ${props.styles}`}>
            <div className="pb-6 text-center">
                <div className="text-2xl font-semibold">{props.heading}</div>
                <h3 className="text-lg text-[#00000080] mt-5 font-[500]">{props.subheading}</h3>
            </div>
            { props.children }
        </div>
    )
}

export default ProductsSection;
