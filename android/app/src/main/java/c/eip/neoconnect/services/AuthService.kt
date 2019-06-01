package c.eip.neoconnect.services

import c.eip.neoconnect.model.Boutique
import c.eip.neoconnect.model.Influenceur
import c.eip.neoconnect.model.LoginModel
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("/inf/register")
    fun registerInfluencer(
        @Body influenceur: Influenceur
    ): Call<Influenceur>

    @POST("/inf/login")
    fun loginInfluencer(
        @Body loginModel: LoginModel
    ): Call<Influenceur>

    @POST("/shop/register")
    fun registerShop(@Body shop: Boutique): Call<Boutique>


    @POST("/shop/login")
    fun loginShop(
        @Body loginModel: LoginModel
    ): Call<Boutique>

}