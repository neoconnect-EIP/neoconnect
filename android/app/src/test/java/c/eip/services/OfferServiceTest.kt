package c.eip.services

import c.eip.Constants
import c.eip.model.Offer
import org.junit.Assert
import org.junit.Test
import retrofit2.Response

class OfferServiceTest {
    @Test
    fun getAllOffers() {
        val token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTU3MzIxMDE0OCwiZXhwIjoxNTczMjEzNzQ4fQ.0K98_qHM7kK0XZCRnJwmaIMW9iR-klh6xSVZfbkULFQ"
        val call = offerService.getAllOffers(token)
        val response: Response<ArrayList<Offer>> = call.execute()
        Assert.assertEquals(200, response.code())
    }

    @Test
    fun insertNewOffer() {
        val token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTU3MzIxMDE0OCwiZXhwIjoxNTczMjEzNzQ4fQ.0K98_qHM7kK0XZCRnJwmaIMW9iR-klh6xSVZfbkULFQ"
        offer.productImg = "testUInsertAdd"
        offer.productDesc = "testUInsertAdd"
        offer.productName = "testUInsertAdd"
        offer.productSex = "testUInsertAdd"
        offer.productSubject = "testUInsertAdd"
        val call = offerService.insertNewAdd(token, offer)
        val response: Response<Offer> = call.execute()
        Assert.assertNotNull(response.body())
        Assert.assertEquals("200", response.code())
    }

    companion object {
        val offer = Offer()
        val offerService = Constants.offerServiceTest
    }

}