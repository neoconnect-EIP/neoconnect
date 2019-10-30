package c.eip.services

import c.eip.Constants
import c.eip.model.Boutique
import c.eip.model.Influenceur
import c.eip.model.LoginModel
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
        loginModelInf.pseudo = "testUAI"
        loginModelInf.password = "testUAI"
        val loginCall = authService.loginInfluencer(loginModelInf)
        val loginResponse: Response<Influenceur> = loginCall.execute()
        val authResponse = loginResponse.body()
        val token: String? = authResponse?.token

        val call = profilService.getInfProfil(token)
        val response: Response<Influenceur> = call.execute()
        Assert.assertNotNull(response.body())
    }

    @Test
    fun getMyShopProfil() {
        loginModelShop.pseudo = "testUAB"
        loginModelShop.password = "testUAB"
        val loginCall = authService.loginShop(loginModelShop)
        val loginResponse: Response<Boutique> = loginCall.execute()
        val authResponse = loginResponse.body()
        val token: String? = authResponse?.token

        val call = profilService.getShopProfil(token)
        val response: Response<Boutique> = call.execute()
        Assert.assertNotNull(response. body())
    }

    @Test
    fun editMyInfProfil() {
        loginModelInf.pseudo = "testUAI"
        loginModelInf.password = "testUAI"

        inf.pseudo = loginModelInf.pseudo
        inf.password = loginModelInf.password
        inf.city = "Kaunas - Litunaie"
        inf.full_name = "android test"
        inf.email = "androidTest@inf.com"
        inf.phone = "0123456789"
        inf.postal = "12345"
        inf.sujet = "high tech"
        inf.facebook = "a"
        inf.twitter = "a"
        inf.snapchat = "a"
        inf.instagram = "a"

        val loginCall = authService.loginInfluencer(loginModelInf)
        val loginResponse: Response<Influenceur> = loginCall.execute()
        val authResponse = loginResponse.body()
        val token: String? = authResponse?.token

        val call = profilService.updateInfProfil(token, inf)
        val response: Response<Influenceur> = call.execute()
        Assert.assertEquals(200, response.code())
    }

    @Test
    fun editMyShopProfil() {
        loginModelShop.pseudo = "testUAB"
        loginModelShop.password = "testUAB"

        shop.pseudo = loginModelShop.pseudo
        shop.password = loginModelShop.password
        shop.city = "Kaunas - Lituanie"
        shop.full_name = "androidShop test"
        shop.email = "androidTest@shop.com"
        shop.phone = "0123456789"
        shop.postal = "12345"
        shop.sujet = "high tech"
        shop.society = "a"
        shop.fonction = "a"

        val loginCall = authService.loginShop(loginModelShop)
        val loginResponse: Response<Boutique> = loginCall.execute()
        val authResponse = loginResponse.body()
        val token: String? = authResponse?.token
        shop.token = token
        val call = profilService.updateShopProfil(token, shop)
        val response: Response<Boutique> = call.execute()
        Assert.assertEquals(200, response.code())
    }

    companion object {
        val inf = Influenceur()
        val shop = Boutique()
        val loginModelShop = LoginModel()
        val loginModelInf = LoginModel()
        private const val baseUrl = Constants.BASE_URL
        private val gson: Gson = GsonBuilder().setLenient().create()
        private val retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson)).build()
        val profilService: ProfilService = retrofit.create(ProfilService::class.java)
        val authService: AuthAPI.AuthService = retrofit.create(AuthAPI.AuthService::class.java)
    }
}