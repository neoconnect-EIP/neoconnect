package c.eip.navigation.loggedIn.shop


import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.navigation.fragment.findNavController
import c.eip.R

class LoggedShopFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_logged_in_shop, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<Button>(R.id.navigate_shop_profile)?.setOnClickListener {
            findNavController().navigate(R.id.shop_profil, null)
        }
        view.findViewById<Button>(R.id.navigate_shop_offer)?.setOnClickListener {
            findNavController().navigate(R.id.shop_offer, null)
        }
    }
}
