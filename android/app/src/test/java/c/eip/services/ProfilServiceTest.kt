package c.eip.services

import c.eip.Constants
import c.eip.model.Boutique
import c.eip.model.Influenceur
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.junit.Assert
import org.junit.Test
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ProfilServiceTest {
    @Test
    fun getMyInfProfil() {
        val token: String? = ""
        val call = profilService.getInfProfil(token)
        val response: Response<Influenceur> = call.execute()
        Assert.assertNotNull(response.body())
    }

    @Test
    fun getMyShopProfil() {
        val token: String? = ""
        val call = profilService.getShopProfil(token)
        val response: Response<Boutique> = call.execute()
        Assert.assertNotNull(response.body())
    }

    companion object {
        val baseUrl = Constants.BASE_URL
        private val gson: Gson = GsonBuilder().setLenient().create()
        private val retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson)).build()
        val profilService = retrofit.create(ProfilService::class.java)
    }

}