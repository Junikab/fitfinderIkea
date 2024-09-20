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

    let hiddenCount= 0;
    products.forEach((product) => {
        const widthCheck =
            !dimensions.width ||
            (product.width && product.width <= dimensions.width);
        const heightCheck =
            !dimensions.height ||
            (product.height && product.height <= dimensions.height);
        const depthCheck =
            !dimensions.depth ||
            (product.depth && product.depth <= dimensions.depth);

        if (widthCheck && heightCheck && depthCheck) {
            (product.element as HTMLElement).style.display = "";
        } else {
            (product.element as HTMLElement).style.display = "none";
            hiddenCount++;
        }
    });
    console.log(`Filtering products. Hidden: ${hiddenCount}, Visible: ${products.length - hiddenCount}`);
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
            sendResponse({ success: true });
        }
        return true;
    }
);

console.log("IKEA Furniture Filter content script loaded");

export {};