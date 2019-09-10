package c.eip.navigation.auth.influenceur


import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.Constants
import c.eip.R
import c.eip.model.Influenceur
import c.eip.model.LoginModel
import c.eip.services.AuthAPI
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LoginFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_influenceur_login, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<Button>(R.id.loginInf).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.pseudo).text.toString()
            val password = view.findViewById<TextInputEditText>(R.id.password).text.toString()
            loginInf(pseudo, password)
        }
        view.findViewById<Button>(R.id.switchRegisterInf)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_register, null)
        }
        view.findViewById<Button>(R.id.switchSideToShop)?.setOnClickListener {
            findNavController().navigate(R.id.shop_auth, null)
        }
    }

    fun loginInf(pseudo: String, password: String) {
        inf.pseudo = pseudo
        inf.password = password
        val authService = retrofit.create(AuthAPI.AuthService::class.java)
        val call = authService.loginInfluencer(inf)
        call.enqueue(object : Callback<Influenceur> {
            override fun onResponse(call: Call<Influenceur>, response: Response<Influenceur>) {
                if (response.isSuccessful) {
                    findNavController().navigate(R.id.loggedInInf, null)
                    Log.i("Connexion influenceur", "token : ${response.body()?.token}")
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
        var retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create())
                .build()
    }
}
