interface Product {
    name: string;
    width: number;
    height: number;
    depth?: number;
    price: number;
}

function extractProductData(): Product[] {
    const products: Product[] = [];

    // Select all product elements
    const productElements = document.querySelectorAll(".plp-fragment-wrapper");

    productElements.forEach((element) => {
        const nameElement = element.querySelector(".plp-price-module__name");
        const descriptionElement = element.querySelector(
            ".plp-price-module__description"
        );
        const priceElement = element.querySelector(".plp-price-module__price"); // the price class

        if (nameElement && descriptionElement && priceElement) {
            const name = nameElement.textContent?.trim() || "";
            const description = descriptionElement.textContent?.trim() || "";
            const dimensionsMatch = description.match(
                /(\d+)x(\d+)(?:x(\d+))?\s*cm/
            );
            const price = parseFloat(
                priceElement.textContent?.replace(/[^0-9.]/g, "") || "0"
            );

            if (dimensionsMatch) {
                const product: Product = {
                    name,
                    width: parseInt(dimensionsMatch[1]),
                    height: parseInt(dimensionsMatch[2]),
                    price,
                };

                if (dimensionsMatch[3]) {
                    product.depth = parseInt(dimensionsMatch[3]);
                }

                products.push(product);
            }
        }
    });

    return products;
}

// Send data to popup when requested
chrome.runtime.onMessage.addListener(
    (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        if (request.action === "getProducts") {
            sendResponse(extractProductData());
        }
    }
);

console.log("IKEA Furniture Filter content script loaded");
