package c.eip.services

import c.eip.model.Contact
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface UtilsService {
    @POST("/contact")
    fun sendMessage(
        @Body contact: Contact
    ): Call<String>
}