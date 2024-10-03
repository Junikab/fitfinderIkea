interface Product {
    // name: string;
    element: Element;
    width?: number;
    height?: number;
    depth?: number;
    // url: string;
}

function extractProductData(): Product[] {
    console.log("Extracting product data")
    const products: Product[] = [];
    // Select all product elements
    const productElements = document.querySelectorAll(".plp-fragment-wrapper");
    console.log(`Found ${productElements.length} product elements.`)

    productElements.forEach((element) => {
        const descriptionElement = element.querySelector(
            ".plp-price-module__description"
        );

        if (descriptionElement) {
            const description = descriptionElement.textContent?.trim() || "";
            const dimensionsMatch = description.match(
                /(\d+)x(\d+)(?:x(\d+))?\s*cm/
            );

            if (dimensionsMatch) {
                const product: Product = {
                    element:element,
                    width: parseInt(dimensionsMatch[1]),
                    height: parseInt(dimensionsMatch[2]),
                    
                };

                if (dimensionsMatch[3]) {
                    product.depth = parseInt(dimensionsMatch[3]);
                }

                products.push(product);
            }
        }
    });
    console.log(`Extracted ${products.length} products.`)
    return products;
}

function filterProducts(dimensions: {
    width: number;
    height: number;
    depth: number;
}) {
    console.log("Filtering products with dimensions", dimensions)
    const products = extractProductData();

    let filteredCount= 0;
    products.forEach((product) => {
        const widthCheck =
            dimensions.width === 0 ||
            (product.width && product.width <= dimensions.width);
        const heightCheck =
            dimensions.height === 0 ||
            (product.height && product.height <= dimensions.height);
        const depthCheck =
            dimensions.depth === 0 ||
            (product.depth && product.depth <= dimensions.depth);

        if (widthCheck && heightCheck && depthCheck) {
            (product.element as HTMLElement).style.opacity = "1";
            (product.element as HTMLElement).style.filter = "none";
            (product.element as HTMLElement).style.border = "none";
        } else {
            (product.element as HTMLElement).style.opacity = "0.2";
            (product.element as HTMLElement).style.filter = "grayscale(100%)";
            (product.element as HTMLElement).style.border = "solid 1px";
            filteredCount++;
        }
    });
    console.log(`Filtering complete. Filtered: ${filteredCount}, Visible: ${products.length - filteredCount}`);
}

function resetFilter(){
    const products = extractProductData();
    products.forEach((product)=>{
        (product.element as HTMLElement).style.opacity = "1";
        (product.element as HTMLElement).style.filter = "none";
    })
}
// Send data to popup when requested
chrome.runtime.onMessage.addListener(
    (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        console.log("Received message:", request)
        if (request.action === "filterProducts") {
            console.log("Filtering with dimensions:", request.dimensions);
            filterProducts(request.dimensions);
            sendResponse({success: true});
        } else if (request.action === "resetFilter"){
            console.log ("Resetting Filter")
            resetFilter();
            sendResponse({ success: true });
        }

        return true;
    }
);

console.log("IKEA Furniture Filter content script loaded");

export {};