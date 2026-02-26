async function fetchWithRetry(apiurl, body, maxAttempts = 10, timeoutMs = 5000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            console.log(`Attempt ${attempt} of ${maxAttempts}`);
            
            const response = await fetch(apiurl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
            
            if (error.name === 'AbortError') {
                console.log(`Attempt ${attempt} timed out after ${timeoutMs}ms`);
            } else {
                console.error(`Error in attempt ${attempt}:`, error);
            }
            
            if (attempt === maxAttempts) {
                console.error(`All ${maxAttempts} attempts failed`);
                throw lastError;
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}


async function cosmosSearch(searchTerm) {
    const apiurl = "https://corsproxy.io/https://api.www.cosmos.so/graphql?q=SearchGlobalElementsUser";
    const body = {
        "operationName": "SearchGlobalElementsUser",
        "variables": {
            "searchTerm": searchTerm,
            "origin": "SEARCH_BOX",
            "userId": null,
            "searchColor": null,
            "isFollowing": null,
            "isAesthetic": null,
            "contentType": null,
            "searchUserId": null,
            "order": null,
            "enablePublicElements": true,
            "pageCursor": null
        },
        "query": "query SearchGlobalElementsUser($searchTerm: String!, $origin: SearchOrigin, $userId: UserId, $searchColor: String, $isFollowing: Boolean, $contentType: ElementContentTypeFilter, $isAesthetic: Boolean, $searchUserId: UserId, $order: ElementOrder, $enablePublicElements: Boolean!) {\n  search(searchTerm: $searchTerm, searchOrigin: $origin) {\n    elements(\n      meta: {}\n      filters: {color: $searchColor, isFollowing: $isFollowing, contentType: $contentType, isAesthetic: $isAesthetic, userId: $searchUserId}\n      order: $order\n    ) {\n      items {\n        ...SearchElementTile\n        __typename\n      }\n      meta {\n        nextPageCursor\n        count\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SearchElementTile on SearchElement {\n  ...BaseSearchElementTile\n  ...SearchElementContextMenu\n  __typename\n}\n\nfragment BaseSearchElementTile on SearchElement {\n  id\n  image {\n    ...ElementImage\n    __typename\n  }\n  ownerId\n  ownerName\n  text\n  type\n  url\n  ownerName\n  articleTitle\n  articleDescription\n  sourceUrl\n  productTitle\n  aiGenerated\n  notSafeForWorkStatus\n  twitterAuthorUsername\n  twitterAuthorName\n  twitterMedia {\n    ...TwitterMedia\n    __typename\n  }\n  instagramAuthorName\n  youtubeAuthorName\n  tikTokAuthorName\n  pinterestAuthorUsername\n  pinterestAuthorName\n  rawVideo {\n    ...ElementRawVideo\n    __typename\n  }\n  mux {\n    ...ElementMux\n    __typename\n  }\n  video {\n    ...ElementVideo\n    __typename\n  }\n  instagramContentAccessibility\n  isInstagramCarousel\n  isTwitterCarousel\n  productPrice {\n    value\n    currency\n    __typename\n  }\n  isPublicDomain\n  isDisliked(userId: $userId)\n  generatedCaption {\n    text\n    __typename\n  }\n  __typename\n}\n\nfragment ElementImage on Image {\n  width\n  height\n  aspectRatio\n  url\n  hash\n  mp4Url\n  mp4ThumbnailUrl\n  __typename\n}\n\nfragment TwitterMedia on TwitterMedia {\n  mediaId\n  video {\n    url\n    isStored\n    __typename\n  }\n  image {\n    ...ElementImage\n    __typename\n  }\n  __typename\n}\n\nfragment ElementRawVideo on Video {\n  thumbnail {\n    hash\n    __typename\n  }\n  width\n  height\n  duration\n  __typename\n}\n\nfragment ElementMux on Mux {\n  mp4Url(quality: LOW)\n  thumbnailImageUrl\n  playbackUrl\n  __typename\n}\n\nfragment ElementVideo on Video {\n  url\n  isStored\n  duration\n  __typename\n}\n\nfragment SearchElementContextMenu on SearchElement {\n  id\n  type\n  url\n  notSafeForWorkStatus\n  numberOfConnectedUsers\n  downloadableImage: image {\n    url\n    __typename\n  }\n  downloadableVideo: video {\n    url\n    isStored\n    __typename\n  }\n  downloadableRawVideo: rawVideo {\n    url\n    isStored\n    __typename\n  }\n  ownerId\n  isUrlEditable\n  isSavedToLibrary(userId: $userId) @skip(if: $enablePublicElements)\n  isUserPublicElement(userId: $userId)\n  isConnectedByUser(userId: $userId)\n  userContext(userId: $userId) {\n    connections {\n      meta {\n        count\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
    };
    
    try {
const response = await fetch(apiurl, {
    method: "POST",
    headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9,fa;q=0.8",
        "authorization": "Bearer undefined",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "origin": "https://www.cosmos.so",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://www.cosmos.so/",
        "sec-ch-ua": '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
        "x-client-name": "web",
        "x-client-version": "2.4.17"
    },
    body: JSON.stringify(body)
});
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Error fetching search results:", error);
        throw error;
    }
    // try {
    //     const result = await fetchWithRetry(apiurl, body);
    //     console.log("Success:", result);
    //     return result;
    // } catch (error) {
    //     console.error("Final error after all retries:", error);
    // }
}

async function getPic(term) {
    try {
        const searchResults = await cosmosSearch(term);
        const randomIndex = Math.floor(Math.random() * 100);
        
        if (searchResults?.data?.search?.elements?.items?.length > 0) {
            const items = searchResults.data.search.elements.items;
            
            if (items[randomIndex]?.image?.url) {
                return items[randomIndex].image.url;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in getPic:", error);
        return null;
    }
}