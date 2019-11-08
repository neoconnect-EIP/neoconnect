package c.eip.services

import c.eip.model.Offer
import retrofit2.Call
import retrofit2.http.*

interface OfferService {
    @GET("/offer/list")
    fun getAllOffers(@Header("authorization") token: String?):
            Call<ArrayList<Offer>>

    @POST("/offer/insert")
    fun insertNewAdd(@Header("authorization") token: String?, @Body offer: Offer):
            Call<Offer>

    @GET("/offer/{id}")
    fun getOneOffer(@Header("authorization") token: String?, @Path("id") id: Int?)
}