export default function(context, inject) {
    const appId = 'P2ZBMTIB65'
    const apiKey = '6330688ce414960199c203be46bae555'
    const headers = {
        "X-Algolia-API-Key": apiKey,
        "X-Algolia-Application-Id": appId
    }

    inject('dataApi', {
        getHome,
        getReviewsByHomeId
    })
    async function getHome(homeId) {
        try {
            return unWrap(await fetch(`https://${appId}-dsn.algolia.net/1/indexes/homes/${homeId}`, { headers }))
        } catch(error) {
            return getErrorResponse(error)
        }
    }

    async function getReviewsByHomeId(homeId) {
        try {
            return unWrap(await fetch(`https://${appId}-dsn.algolia.net/1/indexes/reviews/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    filters: `homeId:${homeId}`,
                    hitsPerPage: 6,
                    attributesToHighlight: []
                })
            }))
        } catch (error) {
            return getErrorResponse(error)
        }
    }

    async function unWrap(response) {
        const json = await response.json()
        const {ok, status, statusText} = response
        return {
            json,
            ok,
            status,
            statusText
        }
    }

    function getErrorResponse(error) {
        return {
            ok: false,
            status: 500,
            statusText: error.message,
            json: {}
        }
    }
}