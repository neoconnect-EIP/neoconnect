package c.eip.neoconnect.services

import c.eip.neoconnect.model.Influenceur
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query

interface AuthService {
    @POST("/inf/register")
    fun registerInfluencer(
        @Body influenceur: Influenceur
    ): Call<Influenceur>

    @POST("/inf/login")
    fun loginInfluencer(
        @Query("pseudo") pseudo: String,
        @Query("password") password: String
    ): Call<Influenceur>
}