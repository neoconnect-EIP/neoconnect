package c.eip.services

import c.eip.model.Boutique
import c.eip.model.Influenceur
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PUT

interface ProfilService {
    @GET("/inf/me")
    fun getInfProfil(
        @Header("authorization") token: String?
    ): Call<Influenceur>

    @GET("/shop/me")
    fun getShopProfil(
        @Header("authorization") token: String?
    ): Call<Boutique>

    @PUT("/inf/me")
    fun updateInfProfil(
        @Header("authorization") token: String?,
        @Body influenceur: Influenceur
    ): Call<Influenceur>

    @PUT("/shop/me")
    fun updateShopProfil(
        @Header("authorization") token: String?,
        @Body shop: Boutique
    ): Call<Boutique>
}