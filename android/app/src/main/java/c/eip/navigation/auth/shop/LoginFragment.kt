package c.eip.navigation.auth.shop


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
import c.eip.model.Boutique
import c.eip.model.LoginModel
import c.eip.services.AuthAPI
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_shop_login, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<Button>(R.id.loginShop).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.pseudo).text.toString()
            val password = view.findViewById<TextInputEditText>(R.id.password).text.toString()
            loginShop(pseudo, password)
        }
        view.findViewById<Button>(R.id.switchRegisterShop)?.setOnClickListener {
            findNavController().navigate(R.id.shop_register, null)
        }
        view.findViewById<Button>(R.id.switchSideToInf)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_auth, null)
        }
    }

    private fun loginShop(pseudo: String, password: String) {
        shop.pseudo = pseudo
        shop.password = password
        val call = authService.loginShop(shop)
        call.enqueue(object : Callback<Boutique> {
            override fun onResponse(call: Call<Boutique>, response: Response<Boutique>) {
                if (response.isSuccessful) {
                    AuthAPI.DataGetter.INSTANCE.saveUserId(
                        context!!,
                        response.body()?.idUser
                    )
                    findNavController().navigate(R.id.loggedInShop, null)
                    Log.i("Connexion boutique", "token : ${response.body()?.token}")
                }
            }

            override fun onFailure(call: Call<Boutique>?, t: Throwable) {
                Log.e("Connexion erreur:", t.message)
            }
        })
    }

    companion object {
        var shop = LoginModel()
        var authService = Constants.authService
    }
}
