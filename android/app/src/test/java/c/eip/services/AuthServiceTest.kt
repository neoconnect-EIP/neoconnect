package c.eip.services

import c.eip.Constants
import c.eip.model.Boutique
import c.eip.model.Influenceur
import c.eip.model.LoginModel
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import junit.framework.Assert.assertEquals
import junit.framework.Assert.assertNotNull
import org.junit.Test
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AuthServiceTest {
    @Test
    fun registerInf() {
        inf.pseudo = "toto"
        inf.password = "a"
        inf.city = "a"
        inf.full_name = "a"
        inf.email = "a"
        inf.phone = "0000000000"
        inf.postal = "00000"
        inf.sujet = "a"
        inf.facebook = "a"
        inf.twitter = "a"
        inf.snapchat = "a"
        inf.instagram = "a"

        val call = authService.registerInfluencer(inf)
        val response: Response<Influenceur> = call.execute()
        assertEquals(200, response.code())
    }

    @Test
    fun loginInf() {
        loginModel.pseudo = "toto"
        loginModel.password = "a"

        val call = authService.loginInfluencer(loginModel)
        val response: Response<Influenceur> = call.execute()
        val authResponse = response.body()
        assertNotNull(authResponse)
        assertEquals(200, response.code())
    }

    @Test
    fun registerShop() {
        shop.pseudo = "toto"
        shop.password = "a"
        shop.city = "a"
        shop.full_name = "a"
        shop.email = "a"
        shop.phone = "0000000000"
        shop.postal = "00000"
        shop.sujet = "a"
        shop.society = "a"
        shop.fonction = "a"

        val call = authService.registerShop(shop)
        val response: Response<Boutique> = call.execute()
        assertEquals(200, response.code())
    }

    @Test
    fun loginShop() {
        loginModel.pseudo = "toto"
        loginModel.password = "a"

        val call = authService.loginShop(loginModel)
        val response: Response<Boutique> = call.execute()
        val authResponse = response.body()
        assertNotNull(authResponse)
        assertEquals(200, response.code())
    }

    companion object {
        var shop = Boutique()
        val inf = Influenceur()
        val loginModel = LoginModel()
        var baseUrl = Constants.BASE_URL
        private val gson: Gson = GsonBuilder()
            .setLenient()
            .create()
        private val retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create(gson)).build()
        val authService: AuthAPI.AuthService = retrofit.create(AuthAPI.AuthService::class.java)
    }
}