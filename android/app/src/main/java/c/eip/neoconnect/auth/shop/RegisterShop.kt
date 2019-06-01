package c.eip.neoconnect.auth.shop

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.TextInputEditText
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import c.eip.neoconnect.Constants
import c.eip.neoconnect.R
import c.eip.neoconnect.model.Boutique
import c.eip.neoconnect.services.AuthService
import kotlinx.android.synthetic.main.register_shop.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RegisterShop : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.register_shop)
        registerShop.setOnClickListener {
            registerShop()
        }
        retour.setOnClickListener {
            val intent = Intent(applicationContext, LoginShop::class.java)
            startActivity(intent)
        }
    }

    fun registerShop() {
        shop.pseudo = findViewById<TextInputEditText>(R.id.pseudo).text.toString()
        shop.password = findViewById<TextInputEditText>(R.id.password).text.toString()
        shop.city = findViewById<TextInputEditText>(R.id.city).text.toString()
        shop.full_name = findViewById<TextInputEditText>(R.id.name).text.toString()
        shop.email = findViewById<TextInputEditText>(R.id.email).text.toString()
        shop.phone = findViewById<TextInputEditText>(R.id.phone).text.toString()
        shop.postal = findViewById<TextInputEditText>(R.id.postal).text.toString()
        shop.sujet = findViewById<TextInputEditText>(R.id.theme).text.toString()
        shop.society = findViewById<TextInputEditText>(R.id.society).text.toString()
        shop.fonction = findViewById<TextInputEditText>(R.id.poste).text.toString()
        val retrofit = Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create()).build()
        val authService = retrofit.create(AuthService::class.java)
        val call = authService.registerShop(shop)
        call.enqueue(object : Callback<Boutique> {
            override fun onResponse(call: Call<Boutique>, response: Response<Boutique>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterShop, "Inscription réussie", Toast.LENGTH_LONG).show()
                    Log.i("Boutique inscription", "User " + shop.pseudo + " inscription OK")
                    val intent = Intent(applicationContext, LoginShop::class.java)
                    startActivity(intent)
                }
            }

            override fun onFailure(call: Call<Boutique>?, t: Throwable) {
                Log.e("Inscription erreur:", t.message)
            }
        })
    }


    companion object {
        var shop = Boutique()
        var baseUrl = Constants.BASE_URL
    }
}
