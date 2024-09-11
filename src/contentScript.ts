interface Product {
    name: string;
    width?: number;
    height?: number;
    depth?: number;
    // price: number;
    url: string;
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
        const linkElement = element.querySelector("a");
        // const priceElement = element.querySelector(".plp-price-module__price"); // the price class

        if (nameElement && descriptionElement && linkElement) {
            const name = nameElement.textContent?.trim() || "";
            const description = descriptionElement.textContent?.trim() || "";
            const dimensionsMatch = description.match(
                /(\d+)x(\d+)(?:x(\d+))?\s*cm/
            );
            const url = new URL(
                linkElement.getAttribute("href") || "",
                window.location.origin
            ).href;
            // const price = parseFloat(
            //     priceElement.textContent?.replace(/[^0-9.]/g, "") || "0"
            // );

            if (dimensionsMatch) {
                const product: Product = {
                    name,
                    width: parseInt(dimensionsMatch[1]),
                    height: parseInt(dimensionsMatch[2]),
                    // price,
                    url,
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
        return true;
    }
);

console.log("IKEA Furniture Filter content script loaded");
