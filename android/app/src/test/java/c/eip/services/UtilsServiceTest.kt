package c.eip.services

import c.eip.Constants
import c.eip.model.Contact
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.junit.Assert
import org.junit.Test
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class UtilsServiceTest {
    @Test
    fun getMyInfProfil() {
        contactData.pseudo = "testFromKotlinTest"
        contactData.email = "testFromKotlinTest@gmail.com"
        contactData.objet = "Test From Kotlin Unit Test"
        contactData.message = "Test"
        val call = utilsService.sendMessage(contactData)
        val response: Response<String> = call.execute()
        Assert.assertEquals(200, response.code())
    }

    companion object {
        val contactData = Contact()
        val utilsService = Constants.utilsServiceTest
    }

}