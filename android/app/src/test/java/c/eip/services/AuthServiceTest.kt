package c.eip.services

import c.eip.Constants
import c.eip.model.Boutique
import c.eip.model.Influenceur
import c.eip.model.LoginModel
import junit.framework.Assert.assertEquals
import junit.framework.Assert.assertNotNull
import org.junit.Test
import retrofit2.Response

class AuthServiceTest {
    @Test
    fun registerInf() {
        inf.pseudo = "testUAI"
        inf.password = "testUAI"
        inf.city = "Kaunas"
        inf.full_name = "android test"
        inf.email = "android@inf.test"
        inf.phone = "0000000000"
        inf.postal = "00000"
        inf.sujet = "Hightech"
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
        loginModelInf.pseudo = "testUAI"
        loginModelInf.password = "testUAI"

        val call = authService.loginInfluencer(loginModelInf)
        val response: Response<Influenceur> = call.execute()
        val authResponse = response.body()
        assertNotNull(authResponse)
        assertEquals(200, response.code())
    }

    @Test
    fun registerShop() {
        shop.pseudo = "testUAB"
        shop.password = "testUAB"
        shop.city = "Kaunas"
        shop.full_name = "androidShop test"
        shop.email = "android@shop.com"
        shop.phone = "0000000000"
        shop.postal = "00000"
        shop.sujet = "high tech"
        shop.society = "a"
        shop.fonction = "a"

        val call = authService.registerShop(shop)
        val response: Response<Boutique> = call.execute()
        assertEquals(200, response.code())
    }

    @Test
    fun loginShop() {
        loginModelShop.pseudo = "testUAB"
        loginModelShop.password = "testUAB"

        val call = authService.loginShop(loginModelShop)
        val response: Response<Boutique> = call.execute()
        val authResponse = response.body()
        assertNotNull(authResponse)
        assertEquals(200, response.code())
    }

    companion object {
        var shop = Boutique()
        val inf = Influenceur()
        val loginModelInf = LoginModel()
        val loginModelShop = LoginModel()
        val authService: AuthAPI.AuthService = Constants.authServiceTest
    }
}