package c.eip.neoconnect.auth.influenceur

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.TextInputEditText
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import c.eip.neoconnect.Constants
import c.eip.neoconnect.R
import c.eip.neoconnect.auth.shop.LoginShop
import c.eip.neoconnect.model.Influenceur
import c.eip.neoconnect.model.LoginModel
import c.eip.neoconnect.services.AuthService
import kotlinx.android.synthetic.main.login_inf.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LoginInf : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login_inf)
        loginInf.setOnClickListener {
            loginInf()
        }
        switchRegisterInf.setOnClickListener {
            val intent = Intent(applicationContext, RegisterInf::class.java)
            startActivity(intent)
        }
        switchSideToShop.setOnClickListener {
            val intent = Intent(applicationContext, LoginShop::class.java)
            startActivity(intent)
        }
    }

    fun loginInf() {
        inf.pseudo = findViewById<TextInputEditText>(R.id.pseudo).text.toString()
        inf.password = findViewById<TextInputEditText>(R.id.password).text.toString()
        val retrofit =
            Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create()).build()
        val authService = retrofit.create(AuthService::class.java)
        val call = authService.loginInfluencer(inf)
        call.enqueue(object : Callback<Influenceur> {
            override fun onResponse(call: Call<Influenceur>, response: Response<Influenceur>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@LoginInf, "Connexion réussie", Toast.LENGTH_SHORT).show()
                    Log.i("Connexion influenceur", "Utilisateur $pseudo connexion OK")
//                    val intent = Intent(applicationContext, LoginInf::class.java)
//                    startActivity(intent)
                }
            }

            override fun onFailure(call: Call<Influenceur>?, t: Throwable) {
                Log.e("Connexion erreur:", t.message)
            }
        })
    }

    companion object {
        var inf = LoginModel()
        var baseUrl = Constants.BASE_URL
    }
}